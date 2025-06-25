const { saveJson } = require("../common");
const dataToFilter = require("./data.json");
const { matchSorter } = require("match-sorter");

function filterProperties(filters) {
  // Helper to get nested property values
  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : null),
        obj
      );
  };

  // Operator handlers
  const operators = {
    $eq: (a, b) => a == b, // Loose equality, change to === for strict if needed
    $ne: (a, b) => a != b, // Loose inequality, change to !== for strict if needed
    $gt: (a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      return !isNaN(numA) && !isNaN(numB) && numA > numB;
    },
    $gte: (a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      return !isNaN(numA) && !isNaN(numB) && numA >= numB;
    },
    $lt: (a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      return !isNaN(numA) && !isNaN(numB) && numA < numB;
    },
    $lte: (a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      return !isNaN(numA) && !isNaN(numB) && numA <= numB;
    },
    $in: (a, b) => Array.isArray(b) && b.some((val) => a == val),
    $nin: (a, b) => Array.isArray(b) && !b.includes(a),
    $regex: (a, b) => {
      try {
        // Ensure 'a' is a string for regex testing
        return new RegExp(b, "i").test(String(a));
      } catch (e) {
        return false; // Invalid regex pattern
      }
    },
    $size: (a, b) =>
      Array.isArray(a) && typeof b === "number" && a.length === b,
    $has: (a, b) =>
      Array.isArray(a) &&
      a.some(
        (itemElem) =>
          itemElem && typeof itemElem === "object" && itemElem.type === b
      ),
    // $matchSorter: (itemValue, searchValue) => {
    //   if (itemValue == null) return false;
    //   return matchSorter([String(itemValue)], searchValue).length > 0;
    // },
  };

  // Validate input: dataToFilter must be an array
  if (!Array.isArray(dataToFilter)) {
    // console.warn("filterProperties: dataToFilter must be an array. Returning empty array.");
    return [];
  }

  // Validate input: filters must be a plain object
  if (
    filters === null ||
    filters === undefined ||
    typeof filters !== "object" ||
    Array.isArray(filters)
  ) {
    // console.warn("filterProperties: Invalid or no filters provided. Returning all data.");
    return dataToFilter; // Or return [] if invalid filters should clear results
  }

  // If filters object is empty, return all data
  if (Object.keys(filters).length === 0) {
    return dataToFilter;
  }

  // Apply filters to each item in dataToFilter
  return dataToFilter.filter((item) => {
    for (const [field, condition] of Object.entries(filters)) {
      // if (field === "area.name" && typeof condition === "string") {
      //   const areaName = getNestedValue(item, "area.name");

      //   // Handle null/undefined values
      //   if (areaName == null) return false;

      //   // Convert to string if needed
      //   const searchString = String(areaName);

      //   // Use match-sorter to check for matches
      //   const matches = matchSorter([searchString], condition);

      //   // If no matches, exclude this item
      //   if (matches.length === 0) return false;

      //   // Continue to next field if matched
      //   continue;
      // }

      if (field === "area.name") {
        const areaName = getNestedValue(item, "area.name");

        // Handle $in operator with fuzzy matching
        if (
          typeof condition === "object" &&
          condition.$in &&
          Array.isArray(condition.$in)
        ) {
          if (areaName == null) return false;

          const strAreaName = String(areaName);
          const matches = condition.$in.some(
            (searchTerm) => matchSorter([strAreaName], searchTerm).length > 0
          );

          if (!matches) return false;

          // Store match details
          item.__matchDetails = item.__matchDetails || {};
          item.__matchDetails["area.name"] = {
            original: areaName,
            matchedSearchTerms: condition.$in.filter(
              (term) => matchSorter([strAreaName], term).length > 0
            ),
          };
          continue;
        }

        // Handle direct string filter
        if (typeof condition === "string") {
          if (areaName == null) return false;

          const strAreaName = String(areaName);
          if (matchSorter([strAreaName], condition).length === 0) return false;

          // Store match details
          item.__matchDetails = item.__matchDetails || {};
          item.__matchDetails["area.name"] = {
            original: areaName,
            matchedSearchTerms: [condition],
          };
          continue;
        }
      }

      // Handle logical OR operator
      if (field === "$or") {
        if (!Array.isArray(condition)) {
          // console.warn("$or condition must be an array. Filter failed for this item.");
          return false; // Malformed $or condition
        }
        // If any sub-filter in the $or array matches, the $or condition is met.
        // If condition is an empty array, .some() returns false, so !false is true, leading to 'return false'.
        // This means an empty $or [] makes the item fail this $or clause, which is logical.
        if (
          !condition.some(
            (subFilter) => filterProperties([item], subFilter).length > 0
          )
        ) {
          return false;
        }
        continue; // Move to the next field in filters
      }

      // Handle logical AND operator
      if (field === "$and") {
        if (!Array.isArray(condition)) {
          // console.warn("$and condition must be an array. Filter failed for this item.");
          return false; // Malformed $and condition
        }
        // All sub-filters in the $and array must match.
        // If condition is an empty array, .every() returns true, so !true is false. The 'if' is not entered.
        // This means an empty $and [] is a pass for this $and clause, which is logical.
        if (
          !condition.every(
            (subFilter) => filterProperties([item], subFilter).length > 0
          )
        ) {
          return false;
        }
        continue; // Move to the next field in filters
      }

      // Get the value of the current field from the item
      const itemValue = getNestedValue(item, field);

      // Process condition if it's an object (e.g., { $gt: 10, $lt: 20 } or nested like { subfield: 'value' })
      if (
        typeof condition === "object" &&
        condition !== null &&
        !Array.isArray(condition)
      ) {
        let conditionPassed = true; // Assume true until a check fails
        // Iterate over operators or nested fields within the condition object
        for (const [op, opValue] of Object.entries(condition)) {
          if (operators[op]) {
            // If 'op' is a known operator (e.g., $gt, $regex)
            if (!operators[op](itemValue, opValue)) {
              conditionPassed = false;
              break; // Operator condition failed
            }
          } else {
            // If 'op' is a nested field (e.g., area: { name: '...' })
            // Recursively filter the itemValue (which should be an object for this to be meaningful)
            // If itemValue is not an object, filterProperties([itemValue], ...) will likely result in an empty array.
            const nestedDataToFilter =
              itemValue !== null && typeof itemValue === "object"
                ? [itemValue]
                : [];
            const nestedResult = filterProperties(nestedDataToFilter, {
              [op]: opValue,
            });
            if (nestedResult.length === 0) {
              conditionPassed = false;
              break; // Nested condition failed
            }
          }
        }
        if (!conditionPassed) return false; // If any part of the object condition failed
      } else {
        // Direct value comparison (implicit $eq)
        if (!operators.$eq(itemValue, condition)) {
          return false;
        }
      }
    }
    return true; // All conditions in filters passed for this item
  });
}

const filters = [
  // { subtype: "house", purpose: "rent", "city.name": "Islamabad" },
  // { price: { $gte: 80000, $lte: 150000 } },
  // { propertyImages: { $size: 10 } },
  // {
  //   $or: [{ subtype: "house" }, { subtype: "flat", bed: { $gte: 4 } }],
  // },
  // { "area.name": "Bahria Enclave", propertyImages: { $has: "cover" } },
  // {
  //   purpose: "buy",
  //   subtype: "plot",
  //   size: 5,
  //   sizeUnit: "marla",
  //   "city.name": "Islamabad",
  //   status: "published",
  // },
  // Use match-sorter for area.name
  {
    "area.name": "soan Garden", // Fuzzy match for "New" in area names
  },

  // Combine with other operators
  {
    "area.name": "Garden", // Exclude exact match
  },
  {
    "area.name": { $in: ["soan", "g-10"] }, // Fuzzy match any
  },
];

filters.forEach((fltr, index) => {
  const dataa = filterProperties(fltr);

  saveJson(
    {
      total: dataToFilter.length,
      filtered: dataa.length,
      properties: dataa,
    },
    `filtered_${index + 1}.json`
  );
});
