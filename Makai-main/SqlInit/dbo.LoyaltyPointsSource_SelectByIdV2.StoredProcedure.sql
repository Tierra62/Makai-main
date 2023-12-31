USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPointsSource_SelectByIdV2]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <4/20/2023>
-- Description: <A record for rewards points source.>
--
-- Code Reviewer:
-- =============================================

CREATE PROC [dbo].[LoyaltyPointsSource_SelectByIdV2]
						@Id int
AS
/*
DECLARE @Id int = 8
EXECUTE [dbo].[LoyaltyPointsSource_SelectByIdV2]
						@Id
*/
BEGIN

	SELECT lps.[Id]
		  ,lps.[Name]
		  ,lps.[PointsAwarded]
		  ,lps.[IsDeleted]
		  ,lps.[IsExpired]
		  ,lps.[DateExpire]
		  ,lps.[DateCreated]
		  ,lps.[DateModified]
		  ,lps.[CreatedBy]
		  ,uc.[FirstName]
		  ,uc.[LastName]
		  ,uc.[Mi]
		  ,uc.[AvatarUrl]
		  ,lps.[ModifiedBy]
		  ,um.[FirstName]
		  ,um.[LastName]
		  ,um.[Mi]
		  ,um.[AvatarUrl]
	FROM [dbo].[LoyaltyPointsSource] as lps
	INNER JOIN [dbo].[Users] AS uc
	ON uc.Id = lps.CreatedBy
	INNER JOIN [dbo].[Users] AS um
	ON um.Id = lps.ModifiedBy
	WHERE lps.Id = @Id
END

GO
