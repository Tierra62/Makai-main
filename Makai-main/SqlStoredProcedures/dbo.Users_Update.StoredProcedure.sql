USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Users_Update]    Script Date: 5/8/2023 4:42:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Bounheuangviseth, Vanhxay
-- Create date: 2/27/2023
-- Description:	Update Users in dbo.Users
-- Reviewer: Christian Ramos

-- MODIFIED BY: Quinn Burch
-- MODIFIED DATE: 04/19/2023
-- Code Reviewer: Santi Llanos
-- Note: removed email from update and added in DOB
-- =============================================
CREATE proc [dbo].[Users_Update]
						 @Id int
						 ,@Phone nvarchar(50)
						 ,@FirstName nvarchar(100)
						 ,@LastName nvarchar(100)
						 ,@Mi nvarchar(2) = null
						 ,@AvatarUrl nvarchar(255) = null
						 ,@DOB datetime2(7)
as
	/*
		DECLARE @Id int = 495
				,@Phone nvarchar(50) = '7427700271'
				,@FirstName nvarchar(100) = 'Mickey'
				,@LastName nvarchar(100) = 'Domo'
				,@Mi nvarchar(2) = 'I'
				,@AvatarUrl nvarchar(255) = null
				,@DOB datetime2(7) = '1991-12-19'

		EXECUTE dbo.Users_SelectById @Id

		EXECUTE dbo.Users_Update 
							@Id
							,@Phone
							,@FirstName 
							,@LastName 
							,@Mi
							,@AvatarUrl
							,@DOB

	    EXECUTE dbo.Users_SelectById @Id
	*/
BEGIN
	DECLARE @DateNow datetime2(7) = getutcdate()

	Update dbo.Users
	SET [Phone] = @Phone,
		[FirstName] = @FirstName,
		[LastName] = @LastName,
		[Mi] = @Mi,
		[AvatarUrl] = @AvatarUrl,
		[DOB] = @DOB,
		[DateModified] = @DateNow
	WHERE [Id] = @Id

END
						
GO
