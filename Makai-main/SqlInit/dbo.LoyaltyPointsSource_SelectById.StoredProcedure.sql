USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPointsSource_SelectById]    Script Date: 5/12/2023 1:58:37 PM ******/
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

CREATE PROC [dbo].[LoyaltyPointsSource_SelectById]
						@Id int
AS
/*
DECLARE @Id int = 8
EXECUTE [dbo].[LoyaltyPointsSource_SelectById]
						@Id
*/
BEGIN

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
	FROM [dbo].[LoyaltyPointsSource]
	WHERE Id = @Id
END

GO
