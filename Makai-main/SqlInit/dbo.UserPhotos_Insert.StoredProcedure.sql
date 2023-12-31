USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[UserPhotos_Insert]    Script Date: 5/12/2023 7:06:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Chrystak, Tierra
-- Create date: 04/12/2023

-- Description: Insert Photos in [dbo].[UserPhotos]
-- Code Reviewer: Quinn Burch

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- =============================================


CREATE proc [dbo].[UserPhotos_Insert]
			@CreatedBy int,
			@ProductId int,
			@ImageUrl nvarchar(255),
			@IsApproved bit,
			@ApprovedBy int = null,
			@Id int OUTPUT


as
/*

Declare @Id int,
		@CreatedBy int = 577,
		@ProductId int = 12,
		@ImageUrl nvarchar(255) = 'fake url',
		@IsApproved bit = 0,
		@ApprovedBy int = 577

Execute dbo.UserPhotos_Insert
		@CreatedBy,
		@ProductId,
		@ImageUrl,
		@IsApproved,
		@ApprovedBy,
		@Id OUTPUT

		SELECT 
		[Id],
		[CreatedBy],
		[StandId],
		[PartnerId],
		[ImageUrl],
		[DateCreated],
		[DateModified],
		[IsApproved],
		[ApprovedBy]

		from dbo.UserPhotos
WHERE Id = @Id
*/


BEGIN

DECLARE @StandId int =(
					Select StandId
					from dbo.Products
					where Id = @ProductId)

DECLARE @PartnerId int =(
					Select PartnerId
					from dbo.Stands
					where Id = @StandId)

INSERT INTO [dbo].[UserPhotos]
           (CreatedBy
           ,StandId
           ,PartnerId
           ,ImageUrl
           ,IsApproved
           ,ApprovedBy)


     VALUES
           (@CreatedBy
           ,@StandId
           ,@PartnerId
           ,@ImageUrl
           ,@IsApproved 
           ,@ApprovedBy)

	SET @Id = SCOPE_IDENTITY()
END


GO
