USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPointsSource_Update]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <4/7/2023>
-- Description: <A rewards points program for users who utilize the app frequently>
--
-- Code Reviewer:
-- =============================================


CREATE PROC [dbo].[LoyaltyPointsSource_Update]
			@Name nvarchar(100)
			,@PointsAwarded int
			,@ModifiedBy int
			,@DateExpire datetime2(7) = null
			,@Id int
AS
/*
DECLARE @Id int = 26;

DECLARE	@Name nvarchar(100) = 'Christmas Special'
		,@PointsAwarded int = 50
		,@ModifiedBy int = 660
		,@DateExpire datetime2(7) = '2023-05-01'
EXECUTE [dbo].[LoyaltyPointsSource_Update]
			@Name
			,@PointsAwarded
			,@ModifiedBy
			,@DateExpire
			,@Id




*/
BEGIN
DECLARE @DateModified datetime2(7) = getutcdate()

	  UPDATE [dbo].[LoyaltyPointsSource]
		SET	[Name] = @Name
			,[PointsAwarded] = @PointsAwarded
			,[DateModified] = @DateModified
			,[ModifiedBy] = @ModifiedBy
			,[DateExpire] = @DateExpire
		WHERE [Id] = @Id




END
GO
