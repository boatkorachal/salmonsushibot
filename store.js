let LAST_SPLIT_RESULT = {}

const getKey = event => {
  const source = event.source
  return source.type === "group"
    ? `group_${source.groupId}`
    : source.type === "user"
    ? `user_${source.userId}`
    : "other"
}

exports.saveLastSplitResult = (event, result) => {
  const key = getKey(event)
  LAST_SPLIT_RESULT[key] = result
}

exports.getLastSplitResult = event => {
  const key = getKey(event)
  return LAST_SPLIT_RESULT[key]
}
