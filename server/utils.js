module.exports = {
  stringifyModesData: (modes) => {
    return modes.map(m => {
      m.data = JSON.stringify(m.data);
      return m;
    })
  },
  parseModesData: (modes) => {
    return modes.map(m => {
      m.data = JSON.parse(m.data);
      return m;
    })
  }
}
