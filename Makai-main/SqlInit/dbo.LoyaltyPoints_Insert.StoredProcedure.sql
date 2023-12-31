USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPoints_Insert]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <4/7/2023>
-- Description: <A rewards points program for users who utilize the app frequently.>
-- Code Reviewer:
-- =============================================


CREATE PROC [dbo].[LoyaltyPoints_Insert]
			@UserId int
			,@SourceId int
			,@Id int OUTPUT

AS
/*

-----------------------------------------------------
DECLARE @Id int = 0
		,@UserId int = 577
		,@SourceId int = 5
		

EXECUTE [dbo].[LoyaltyPoints_Insert]
		@UserId
		,@SourceId
		,@Id OUTPUT

-----------------------------------------------------

*/

BEGIN
	DECLARE @Points INT = (SELECT PointsAwarded
								FROM [dbo].[LoyaltyPointsSource] as lps
								WHERE @SourceId = lps.Id)

	INSERT INTO [dbo].[LoyaltyPoints]
				([UserId]
				,[SourceId]
				,[Points])
		VALUES (@UserId
				,@SourceId
				,@Points)
		SET @Id = SCOPE_IDENTITY() 


END
GO
