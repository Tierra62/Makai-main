USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[UserPhotos_Update_IsApproved]    Script Date: 5/12/2023 7:06:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Chrystak, Tierra
-- Create date: 04/13/2023

-- Description: Update IsApproved of User Photos from [dbo].[UserPhotos]
-- Code Reviewer: Josiah Gonzales

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- =============================================

CREATE proc [dbo].[UserPhotos_Update_IsApproved]
		@IsApproved bit,
		@Id int

as

/*
Declare @Id int = 19
Declare @IsApproved bit = 0

Select *
from [dbo].[UserPhotos]

Execute dbo.UserPhotos_Update_IsApproved
	   @IsApproved,
	   @Id

Select * 
from [dbo].[UserPhotos]
*/

BEGIN

DECLARE @DateNow datetime2(7) = GETUTCDATE();

UPDATE [dbo].[UserPhotos]
SET		[IsApproved] = @IsApproved,
		[DateModified] = @DateNow
WHERE   Id = @Id


END
GO
