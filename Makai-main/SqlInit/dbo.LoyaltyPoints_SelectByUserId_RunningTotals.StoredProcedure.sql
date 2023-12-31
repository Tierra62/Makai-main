USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPoints_SelectByUserId_RunningTotals]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <4/10/2023>
-- Description: <Total POINTS record for the user.
--
--				'TotalLifeTimePoints' = Total points awarded to the user ALL POINTSAWARDED REGARDLESS OF EXPIRED/DELETED
--				'TotalPointsRedeemed' = Total redeemed points by the user ONLY NEGATIVE POINTSAWARDED REGARDLESS OF EXPIRED/DELETED
--				'TotalPointsAvailable' = Total remaining points for the user ONLY IF NOT EXPIRED/DELETED - TotalPointsRedeemed>
--
-- Code Reviewer:
-- =============================================

CREATE PROC [dbo].[LoyaltyPoints_SelectByUserId_RunningTotals]
				       @UserId int
AS
/*

DECLARE @UserId int = 8;

EXECUTE [dbo].[LoyaltyPoints_SelectByUserId_RunningTotals]
					   @UserId;
					    

*/
BEGIN

SELECT lp.[UserId]		  
		,u.[FirstName]
		,u.[LastName]
		,u.[Mi]
		,u.[AvatarUrl]
		,(SUM(CASE WHEN lps.PointsAwarded > 0 THEN lps.PointsAwarded ELSE 0 END)) AS TotalLifeTimePoints 
		,(SUM(CASE WHEN lps.PointsAwarded < 0 THEN lps.PointsAwarded ELSE 0 END)) AS TotalPointsRedeemed
		,(SUM(CASE WHEN IsDeleted = 0 AND IsExpired = 0 THEN lps.PointsAwarded ELSE 0 END)) AS TotalPointsAvailable
FROM [dbo].[LoyaltyPoints] AS lp
INNER JOIN [dbo].[LoyaltyPointsSource] as lps
ON lp.SourceId = lps.Id
INNER JOIN [dbo].[Users] as u
ON u.Id = @UserId
WHERE lp.UserId = @UserId
GROUP BY lp.[UserId], u.[FirstName], u.[LastName],u.[Mi],u.[AvatarUrl]

END

GO
