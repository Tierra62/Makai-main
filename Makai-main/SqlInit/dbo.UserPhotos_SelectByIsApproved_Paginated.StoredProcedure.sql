USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[UserPhotos_SelectByIsApproved_Paginated]    Script Date: 5/12/2023 7:06:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Chrystak, Tierra
-- Create date: 04/13/2023

-- Description: 
-- Code Reviewer: Josiah Gonzales

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:  
-- =============================================

CREATE proc [dbo].[UserPhotos_SelectByIsApproved_Paginated]
			
				@PageIndex int,
				@PageSize int,
				@IsApproved bit

as
/*
	DECLARE
			
			@PageIndex int = 0,
			@PageSize int = 10,
			@IsApproved bit = 1
	EXECUTE dbo.UserPhotos_SelectByIsApproved_Paginated 
			@PageIndex,
			@PageSize,
			@IsApproved
*/

BEGIN
	
		DECLARE @offset int = @PageIndex * @PageSize



SELECT UserPhotos.[Id]
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
	  ,TotalCount = COUNT(1) OVER()
	

FROM [dbo].[UserPhotos] as UserPhotos Inner join dbo.Users as Users 
							on UserPhotos.CreatedBy = Users.Id 
							inner join dbo.Partners as Partners on UserPhotos.PartnerId = Partners.Id 







WHERE UserPhotos.IsApproved = 1

ORDER BY Id

	 OFFSET @offset ROWS
	FETCH NEXT @PageSize ROWS ONLY
END
GO
