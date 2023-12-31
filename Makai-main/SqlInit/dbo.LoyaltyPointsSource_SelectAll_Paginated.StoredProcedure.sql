USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPointsSource_SelectAll_Paginated]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <4/19/2023>
-- Description: <A paginated record for rewards points source. Sorted by alphabetical order.>
--
-- Code Reviewer:
-- =============================================

CREATE PROC [dbo].[LoyaltyPointsSource_SelectAll_Paginated]
						@PageIndex int
					   ,@PageSize int
AS
/*
DECLARE @PageIndex int = 0
       ,@PageSize int = 10;
EXECUTE [dbo].[LoyaltyPointsSource_SelectAll_Paginated]
						@PageIndex
					   ,@PageSize
*/
BEGIN

	DECLARE @offset int = @PageIndex * @PageSize

	SELECT [Id]
		  ,[Name]
		  ,[PointsAwarded]
		  ,[IsDeleted]
		  ,[IsExpired]
		  ,[DateExpire]
		  ,[DateCreated]
		  ,[DateModified]
		  ,[CreatedBy]
		  ,[ModifiedBy]
		  ,TotalCount = COUNT(1) OVER()
	FROM [dbo].[LoyaltyPointsSource]
	WHERE IsDeleted = 0
	ORDER BY [Id]
	OFFSET @offset Rows
	Fetch Next @PageSize Rows ONLY;
END

GO
