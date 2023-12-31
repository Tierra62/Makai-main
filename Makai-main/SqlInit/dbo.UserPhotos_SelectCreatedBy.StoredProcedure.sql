USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[UserPhotos_SelectCreatedBy]    Script Date: 5/12/2023 7:06:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Chrystak, Tierra
-- Create date: 04/12/2023

-- Description: Made UserPhotos_SelectCreatedBy
-- Code Reviewer: Quinn Burch

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- =============================================

CREATE proc [dbo].[UserPhotos_SelectCreatedBy]
				@CreatedBy int

				



as
/*

Declare @CreatedBy int = 8

 Execute dbo.UserPhotos_SelectCreatedBy @CreatedBy 


 
*/


BEGIN

SELECT  UserPhotos.[Id]
      ,UserPhotos.[CreatedBy]
	  ,Users.[FirstName]
	  ,Users.[LastName]
	  ,Users.[AvatarUrl]
	  ,Users.[Email]
      ,UserPhotos.[StandId]
      ,UserPhotos.[PartnerId]
      ,UserPhotos.[ImageUrl]
      ,UserPhotos.[DateCreated]
      ,UserPhotos.[DateModified]
      ,UserPhotos.[IsApproved]
      ,UserPhotos.[ApprovedBy]
	  ,Partners.[Name]


FROM dbo.UserPhotos as UserPhotos Inner join dbo.Users as Users 
							on UserPhotos.CreatedBy = Users.Id 
							inner join dbo.Partners as Partners on UserPhotos.PartnerId = Partners.Id 

WHERE UserPhotos.[CreatedBy] = @CreatedBy



END


GO
