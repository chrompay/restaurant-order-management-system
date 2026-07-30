function stripOperators(value) {
  if (Array.isArray(value)) {
    value.forEach(stripOperators);
    return;
  }

  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete value[key];
        continue;
      }

      stripOperators(value[key]);
    }
  }
}

// Strips MongoDB operator keys ($where, $ne, etc.) and dotted paths from
// req.body so a client can't inject query operators into fields that get
// used in a Mongo filter. req.body is a plain mutable object under Express
// 5, unlike req.query (a read-only getter) — mutate it in place.
const sanitizeBody = (req, res, next) => {
  stripOperators(req.body);
  next();
};

module.exports = sanitizeBody;
