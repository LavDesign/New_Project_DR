
const joinEntitiesStatsLinkedin = (entities, stats) => {
  const join = (A, B) =>
    A.map((x) => ({ ...B.find((y) => y.id == x.id), ...x }));
  if (!stats) return entities;

  return join(
    entities,
    stats.map((x) => ({ ...x, id: x['pivotValue'].split(':').pop() }))
  );
};

const joinEntitiesStatsFacebook = (entities, stats) => {
  const join = (A, B) =>
    A.map((x) =>
      // stats objects will have the lowest available id
      ({
        ...B.find((y) => x.id === (y.ad_id || y.adset_id || y.campaign_id)),
        ...x,
      })
    );
  if (!stats) return entities;

  return join(entities, stats);
};

// NOTE if this modifies "entities" there will be infinite render loop
export const joinEntitiesStats = (entities, stats, platform) => {
  switch (platform) {
    case 'linkedin':
      return joinEntitiesStatsLinkedin(entities, stats);
    case 'facebook':
      return joinEntitiesStatsFacebook(entities, stats);
    default:
      break;
  }
};
