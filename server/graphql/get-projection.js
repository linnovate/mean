export default function getProjection (fieldASTs) {
  console.log('gtttttttttt', fieldASTs.selectionSet)
  return fieldASTs.selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = 1;
    return projections;
  }, {});
}