-- Season 2 Summary Statistics
-- Run this to get key metrics for your season 2 snapshot

SELECT 
    -- Total Users
    COUNT(*) as total_active_users,
    
    -- Users with Game State
    COUNT(gs.id) as users_with_game_state,
    
    -- Users by Division
    COUNT(CASE WHEN d.name IS NOT NULL THEN 1 END) as users_in_divisions,
    
    -- Season 2 Applications
    COUNT(uaa.id) as season2_applications,
    COUNT(CASE WHEN uaa.status = 'APPROVED' THEN 1 END) as season2_approved,
    COUNT(CASE WHEN uaa.status = 'PENDING' THEN 1 END) as season2_pending,
    COUNT(CASE WHEN uaa.claimed = true THEN 1 END) as season2_claimed,
    
    -- Top Performers
    COUNT(CASE WHEN gs."coinsCollected" >= 10000 THEN 1 END) as users_10k_plus_coins,
    COUNT(CASE WHEN gs."coinsCollected" >= 50000 THEN 1 END) as users_50k_plus_coins,
    COUNT(CASE WHEN gs."coinsCollected" >= 100000 THEN 1 END) as users_100k_plus_coins,
    
    -- Activity Metrics
    COUNT(CASE WHEN gs."lastMined" > NOW() - INTERVAL '7 days' THEN 1 END) as active_last_7_days,
    COUNT(CASE WHEN gs."lastMined" > NOW() - INTERVAL '30 days' THEN 1 END) as active_last_30_days,
    
    -- Average Stats
    AVG(COALESCE(gs."coinsCollected", 0)) as avg_coins_collected,
    AVG(COALESCE(gs."minerCount", 1)) as avg_miner_count,
    
    -- Max Stats
    MAX(COALESCE(gs."coinsCollected", 0)) as max_coins_collected,
    MAX(COALESCE(gs."minerCount", 1)) as max_miner_count

FROM "User" u
LEFT JOIN "GameState" gs ON u.id = gs."userId"
LEFT JOIN "Division" d ON gs."divisionId" = d.id
LEFT JOIN "UserAirdropApplication" uaa ON u.id = uaa."userId" 
    AND uaa."airdropSeasonId" = 'cmd71ei1v0000js0449mlzsgf'
WHERE u."isActive" = true; 