/**
 * Handle ids on board-style nodes are `<net>:<hole>`. Holes sharing a net
 * prefix are electrically common, so connectivity can be resolved from edge
 * endpoints alone, without knowing any node's geometry.
 */
export function holeNet(handleId: string) {
  return handleId.split(':')[0]
}
