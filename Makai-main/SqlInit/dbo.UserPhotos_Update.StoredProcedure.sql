USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[UserPhotos_Update]    Script Date: 5/12/2023 7:06:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Chrystak, Tierra
-- Create date: 04/13/2023

-- Description: User Photos Update from [dbo].[UserPhotos]
-- Code Reviewer: 

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- =============================================

CREATE proc [dbo].[UserPhotos_Update]

		@CreatedBy int,
		@StandId int,
		@PartnerId int,
		@ImageUrl nvarchar(255),
		@ApprovedBy int,
		@Id int


as
/*
Declare @Id int = 17

Declare @CreatedBy int = 8,
		@StandId int = 3, 
		@PartnerId int = 11,
		@ImageUrl nvarchar(255) = 'testing123blahblah',
		@ApprovedBy int = 12

Select * from 
dbo.userPhotos
Where Id = @Id

Execute dbo.UserPhotos_Update
		@CreatedBy,
		@StandId,
		@PartnerId,
		@ImageUrl,
		@ApprovedBy,
		@Id

Select * from 
dbo.userPhotos

*/

BEGIN
	
								
DECLARE @dateNow datetime2 = getutcdate();

UPDATE [dbo].[UserPhotos]
	SET [CreatedBy] = @CreatedBy,
		[StandId] = @StandId,
		[PartnerId] = @PartnerId,
		[ImageUrl] = @ImageUrl,
		[IsApproved] = 0,
		[ApprovedBy] = @ApprovedBy,
		[DateModified] = @dateNow
		WHERE Id = @Id

 
 END


GO
