USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Users_UpdatePasswordV2]    Script Date: 5/8/2023 4:42:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Quinn Burch
-- Create date: 05/03/2023
-- Description: Update just the password for a logged in user
-- Code Reviewer: Santi Llanos

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
CREATE proc [dbo].[Users_UpdatePasswordV2]
					@UserId int,
					@Password nvarchar(100)

		/*
			Declare @UserId int = 708,
					@Password nvarchar(100) = 'ndjfslfj3nefds'


			SELECT [Password]
			FROM dbo.Users
			WHERE Id = @UserId

			Execute dbo.Users_UpdatePasswordV2
										@UserId,
										@Password

			SELECT [Password]
			FROM dbo.Users
			WHERE Id = @UserId

		*/
as
BEGIN
	Update [dbo].[Users]
	SET [Password] = @Password
	WHERE [Id] = @UserId
END
GO
