function convertArrayToTurples(items: Array<any>, size=2) {
    return items.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(items.slice(i, i + size))
      return acc
    }, [])
}
export default {
    convertArrayToTurples
}