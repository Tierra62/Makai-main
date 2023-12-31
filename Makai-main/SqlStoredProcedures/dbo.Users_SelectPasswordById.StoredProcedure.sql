USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectPasswordById]    Script Date: 5/8/2023 4:42:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Quinn Burch
-- Create date: 05/04/2023
-- Description: Gets hashed password for user by user Id
-- Code Reviewer: Santi Llanos

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
CREATE proc [dbo].[Users_SelectPasswordById]
								@Id int

		/*
				Declare @Id int = 680;
				
				Execute dbo.Users_SelectPasswordById
												@Id
		*/
as
BEGIN
	SELECT [Password]
	FROM dbo.Users
	WHERE [Id] = @Id
END
GO
