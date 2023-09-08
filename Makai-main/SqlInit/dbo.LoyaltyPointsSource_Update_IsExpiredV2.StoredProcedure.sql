USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LoyaltyPointsSource_Update_IsExpiredV2]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <5/1/2023>
-- Description: <A rewards points program for users who utilize the app frequently
--
--				'IsExpired' = 0 false; 1 true
--								THIS PROC will mark expired and leave the record in place.
--				'ModifiedBy' = admin user expected>
--					
-- Code Reviewer:
-- =============================================


CREATE PROC [dbo].[LoyaltyPointsSource_Update_IsExpiredV2]
			@ModifiedBy int
			,@Id int
AS
/*
DECLARE @Id int = 19;

DECLARE	@ModifiedBy int = 660
EXECUTE [dbo].[LoyaltyPointsSource_Update_IsExpiredV2]
			@ModifiedBy
			,@Id
SELECT * FROM [dbo].[LoyaltyPointsSource]



*/
BEGIN 
	DECLARE @DateExpire datetime2(7) = (SELECT [dateExpire]
										FROM [dbo].[LoyaltyPointsSource]
										WHERE [Id] = @Id) 
	If ((SELECT [IsExpired] FROM [dbo].[LoyaltyPointsSource] WHERE[Id] = @Id) = 0 AND GETDATE() > @DateExpire) 
	BEGIN　
	DECLARE @DateModified datetime2(7) = getutcdate()
	DECLARE @IsExpired bit = 1;

		  UPDATE [dbo].[LoyaltyPointsSource]
			SET	[IsExpired] = @IsExpired　
				,[DateModified] = @DateModified
				,[ModifiedBy] = @ModifiedBy　
			WHERE [Id] = @Id　　　
	END
END
GO
