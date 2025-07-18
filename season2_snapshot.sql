-- Season 2 User Snapshot Query
-- Run this in your PostgreSQL database to export user data with game state
-- Copy the results and save as CSV file

COPY (
    SELECT 
        u.id as user_id,
        u.tgId as telegram_id,
        u.name as user_name,
        u.nickname as nickname,
        u.username as username,
        u.twitterUsername as twitter_username,
        u.twitterName as twitter_name,
        u.twitterId as twitter_id,
        u.country as country,
        u.createdAt as user_created_at,
        u.isActive as is_active,
        u.isBanned as is_banned,
        u.role as user_role,
        u.solanaWalletAddress as solana_wallet,
        u.tonWalletAddress as ton_wallet,
        u.referralCode as referral_code,
        u.notes as admin_notes,
        
        -- Game State Information
        COALESCE(gs.coinsCollected, 0) as total_coins_collected,
        COALESCE(gs.coinsCollectedToday, 0) as coins_collected_today,
        COALESCE(gs.collectionAttemptsToday, 0) as collection_attempts_today,
        COALESCE(gs.slotSpinsAttemptsToday, 0) as slot_spins_today,
        COALESCE(gs.dailySlotSpinsMax, 20) as daily_slot_spins_max,
        COALESCE(gs.wheelSpinsToday, 0) as wheel_spins_today,
        COALESCE(gs.dailyWheelSpinsMax, 1) as daily_wheel_spins_max,
        COALESCE(gs.totalCoinsPurchased, 0) as total_coins_purchased,
        COALESCE(gs.totalWaitTimeReduction, 0) as total_wait_time_reduction,
        COALESCE(gs.slotSpinTickets, 0) as slot_spin_tickets,
        COALESCE(gs.wheelSpinTickets, 0) as wheel_spin_tickets,
        COALESCE(gs.minerCount, 1) as miner_count,
        COALESCE(gs.miningRate, 0.928) as mining_rate,
        gs.lastMined as last_mined_at,
        gs.nextCollectAt as next_collect_at,
        gs.updatedAt as game_state_updated_at,
        
        -- Submarine Information
        gs.submarineCollected as submarine_collected,
        gs.submarineDuration as submarine_duration,
        gs.submarineEndsAt as submarine_ends_at,
        gs.submarineRewards as submarine_rewards,
        gs.submarineStartedAt as submarine_started_at,
        
        -- Division Information
        d.name as division_name,
        d.minCoins as division_min_coins,
        d.maxCoins as division_max_coins,
        
        -- User Rank Information
        ur.rank as global_rank,
        ur.coins as rank_coins,
        ur.divisionRank as division_rank,
        ur.updatedAt as rank_updated_at,
        
        -- Season 2 Airdrop Application Status
        CASE 
            WHEN uaa.id IS NOT NULL THEN 'APPLIED'
            ELSE 'NOT_APPLIED'
        END as season2_application_status,
        uaa.status as season2_application_status_detail,
        uaa.appliedAt as season2_applied_at,
        uaa.claimed as season2_claimed,
        uaa.claimedAt as season2_claimed_at,
        uaa.walletAddress as season2_wallet_address,
        uaa.amount as season2_amount,
        
        -- Character Information
        uc.name as character_name,
        uc.avatarUrl as character_avatar,
        uc.bodyColorId as body_color_id,
        uc.headwearId as headwear_id,
        uc.eyewearId as eyewear_id,
        uc.footwearId as footwear_id,
        uc.boatId as boat_id,
        
        -- User Activity Summary
        (SELECT COUNT(*) FROM "ChallengeProgress" cp WHERE cp.userId = u.id) as total_challenges_completed,
        (SELECT COUNT(*) FROM "UserReward" ur WHERE ur.userId = u.id) as total_rewards_earned,
        (SELECT COUNT(*) FROM "Transaction" t WHERE t.userId = u.id) as total_transactions,
        (SELECT COUNT(*) FROM "UserItem" ui WHERE ui.userId = u.id) as total_items_owned,
        (SELECT COUNT(*) FROM "RaffleEntry" re WHERE re.userId = u.id) as total_raffle_entries,
        (SELECT COUNT(*) FROM "PresaleContribution" pc WHERE pc.userId = u.id) as total_presale_contributions
        
    FROM "User" u
    LEFT JOIN "GameState" gs ON u.id = gs.userId
    LEFT JOIN "Division" d ON gs.divisionId = d.id
    LEFT JOIN "UserRank" ur ON u.id = ur.userId
    LEFT JOIN "UserCharacter" uc ON u.id = uc.userId
    LEFT JOIN "UserAirdropApplication" uaa ON u.id = uaa.userId 
        AND uaa.airdropSeasonId = 'cmd71ei1v0000js0449mlzsgf' -- Season 2 airdrop ID
    WHERE u.isActive = true
    ORDER BY gs.coinsCollected DESC NULLS LAST, u.createdAt ASC
) TO STDOUT WITH CSV HEADER; 