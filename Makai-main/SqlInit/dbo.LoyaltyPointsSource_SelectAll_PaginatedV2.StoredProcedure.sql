USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPointsSource_SelectAll_PaginatedV2]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <4/26/2023>
-- Description: <A paginated record for rewards points source. Sorted by alphabetical order.>
--
-- Code Reviewer:
-- =============================================

CREATE PROC [dbo].[LoyaltyPointsSource_SelectAll_PaginatedV2]
						@PageIndex int
					   ,@PageSize int
AS
/*
DECLARE @PageIndex int = 0
       ,@PageSize int = 10;
EXECUTE [dbo].[LoyaltyPointsSource_SelectAll_PaginatedV2]
						@PageIndex
					   ,@PageSize
*/
BEGIN

	DECLARE @offset int = @PageIndex * @PageSize

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
		  ,TotalCount = COUNT(1) OVER()
	FROM [dbo].[LoyaltyPointsSource] as lps
	INNER JOIN [dbo].[Users] AS uc
	ON uc.Id = lps.CreatedBy
	INNER JOIN [dbo].[Users] AS um
	ON um.Id = lps.ModifiedBy
	WHERE IsDeleted = 0
	ORDER BY lps.[Id]
	OFFSET @offset Rows
	Fetch Next @PageSize Rows ONLY;
END

GO
