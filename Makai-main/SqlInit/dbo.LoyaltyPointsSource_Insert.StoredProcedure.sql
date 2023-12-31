USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPointsSource_Insert]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <4/7/2023>
-- Description: <A rewards points program for users who utilize the app frequently
--
--				'Name' = name of the points "log in" / "5 dollar off"
--				'PointsAwarded' = fix points. "log in point = 5" / "5 dollar off = -500"
--				'CreatedBy'/'ModifiedBy' = admin expected>
--
-- Code Reviewer:
-- =============================================


CREATE PROC [dbo].[LoyaltyPointsSource_Insert]
			@Name nvarchar(100)
			,@PointsAwarded int
			,@CreatedBy int
			,@ModifiedBy int
			,@DateExpire datetime2(7) = null
			,@Id int OUTPUT
AS
/*
DECLARE @Id int = 0
		,@Name nvarchar(100) = 'Test'
		,@PointsAwarded int = 5
		,@CreatedBy int = 660
		,@ModifiedBy int = 660
		,@DateExpire datetime2(7) = '2023-04-26'
EXECUTE [dbo].[LoyaltyPointsSource_Insert]
			@Name
			,@PointsAwarded
			,@CreatedBy
			,@ModifiedBy
			,@DateExpire
			,@Id OUTPUT

			select * from [dbo].[LoyaltyPointsSource]

*/
BEGIN

INSERT INTO [dbo].[LoyaltyPointsSource]
			([Name]
			,[PointsAwarded]
			,[CreatedBy]
			,[ModifiedBy]
			,[DateExpire])
	VALUES
			(@Name
			,@PointsAwarded
			,@CreatedBy
			,@ModifiedBy
			,@DateExpire)

	SET @Id = SCOPE_IDENTITY()




END
GO
