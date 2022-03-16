module.exports = (fnc) => (req, res, next) => {
  fnc(req, res, next).catch(next);
};
