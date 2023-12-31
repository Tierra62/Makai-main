USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPoints_SelectByUserId_Paginated]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <4/10/2023>
-- Description: <A paginated record for rewards points granted. Recent points shown on the top.>
--
-- Code Reviewer:
-- =============================================

CREATE PROC [dbo].[LoyaltyPoints_SelectByUserId_Paginated]
						@PageIndex int
					   ,@PageSize int
				       ,@UserId int

AS
/*
DECLARE @PageIndex int = 0
       ,@PageSize int = 30;

DECLARE @UserId int = 577


EXECUTE [dbo].[LoyaltyPoints_SelectByUserId_Paginated]
						@PageIndex
					   ,@PageSize
					   ,@UserId

					   select * from [dbo].[loyaltyPoints]

					

*/
BEGIN

	DECLARE @offset int = @PageIndex * @PageSize

	SELECT lp.[Id]
		  ,lp.[UserId]
		  ,u.[FirstName]
		  ,u.[LastName]
		  ,u.[Mi]
		  ,u.[AvatarUrl]
		  ,lp.[SourceId] as LoyaltyPointSourceId
		  ,lps.[Name] as LoyaltyPointSourceName
		  ,lps.[PointsAwarded] as LoyaltyPointSourcePointsAwarded
		  ,lps.[IsDeleted] as LoyaltyPointSourceIsDeleted
		  ,lps.[IsExpired] as LoyaltyPointSourceIsExpired
		  ,lps.[DateExpire] as LoyaltyPointSourceDateExpire
		  ,lps.[DateCreated] as LoyaltyPointSourceDateCreated
		  ,lps.[DateModified] as LoyaltyPointSourceDateModified
		  ,lps.[CreatedBy] as LoyaltyPointSourceCreatedBy
		  ,uc.[FirstName]
		  ,uc.[LastName]
		  ,uc.[Mi]
		  ,uc.[AvatarUrl]
		  ,lps.[ModifiedBy] as LoyaltyPointSourceModifiedBy
		  ,um.[FirstName]
		  ,um.[LastName]
		  ,um.[Mi]
		  ,um.[AvatarUrl]
		  ,lp.[DateCreated]
		  ,TotalCount = COUNT(1) OVER()
      FROM [dbo].[LoyaltyPoints] as lp
	  INNER JOIN [dbo].[LoyaltyPointsSource] as lps
	  ON lp.SourceId = lps.Id
	  INNER JOIN [dbo].[Users] as u
	  ON u.Id = lp.UserId
	  INNER JOIN [dbo].[Users] AS uc
	  ON uc.Id = lps.CreatedBy
	  INNER JOIN [dbo].[Users] AS um
	  ON um.Id = lps.ModifiedBy
	  WHERE [UserId] = @UserId AND IsDeleted = 0

	  ORDER BY lp.[Id] DESC

	  OFFSET @offSet Rows
	  Fetch Next @PageSize Rows ONLY;

END
GO
