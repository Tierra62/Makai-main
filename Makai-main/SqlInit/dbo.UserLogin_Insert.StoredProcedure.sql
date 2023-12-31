USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[UserLogin_Insert]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <5/8/2023>
-- Description: <logging in login>
--
-- Code Reviewer:
-- =============================================

CREATE PROC [dbo].[UserLogin_Insert]
			@UserId int
			,@Email nvarchar(255)
			,@IPAddress nvarchar(50)
			,@Id int OUTPUT
AS
/*

DECLARE @Id int = 0
		,@UserId int = 12
		,@Email nvarchar(255) = 'jony@gmail.com'
		,@IPAddress nvarchar(50) = '192.162.0.0.1'
EXECUTE [dbo].[UserLogin_Insert]
			@UserId
			,@Email
			,@IPAddress
			,@Id OUTPUT

			Select * from [dbo].[UserLogins]
			Select * from [dbo].[LoyaltyPoints]
			
*/

BEGIN


IF NOT EXISTS (
        SELECT 1
        FROM [dbo].[UserLogins]
        WHERE [UserId] = @UserId
        AND CONVERT(date, [DateLoggedIn]) = CONVERT(date, GETDATE())
    )
	BEGIN
	INSERT INTO [dbo].[UserLogins]
			([UserId]
			,[Email]
			,[IPAddress])
		 VALUES
			(@UserId
			,@Email
			,@IPAddress)

		
		SET @Id = SCOPE_IDENTITY()

	DECLARE @Points INT = (SELECT PointsAwarded
								FROM [dbo].[LoyaltyPointsSource] as lps
								WHERE 5 = lps.Id)

	INSERT INTO [dbo].[LoyaltyPoints]
				([UserId]
				,[SourceId]
				,[Points])
		VALUES (@UserId
				,5
				,@Points)
	END
END
GO
