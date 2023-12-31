USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[GroupDiscounts_SelectByPartnerId_PaginatedV2]    Script Date: 9/05/2023 12:18:03 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

  -- =============================================
-- Author: <Kenneth Montoya>
-- Create date: <12/04/2023>
-- Description: <GroupDiscounts_SelectByPartnerId>
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
CREATE   PROC [dbo].[GroupDiscounts_SelectByPartnerId_PaginatedV2]
			 @CurrentUserId int
			,@PageIndex int 
            ,@PageSize int

				
/*
TEST CODE

EXECUTE [dbo].[GroupDiscounts_SelectByPartnerId_PaginatedV2] 578,0,5

*/
as
BEGIN

  Declare @offset int = @PageIndex * @PageSize

  	DECLARE @partnerId int = (SELECT  p.Id
								FROM Partners as p
								WHERE p.CreatedBy = @CurrentUserId AND p.IsActive = 1)

IF @partnerId IS NULL

BEGIN
    THROW 50100, 'Current user is not associated with any Partner', 1;
    RETURN;
END;


	SELECT [gd].[Id]
		  ,[gd].[Name]
		  ,[gd].[Description]
		  ,[gd].[PartnerId]
		  ,[dt].[Id] as DiscountId
		  ,[dt].[Name] as DiscountName
		  ,[gd].[Value]
		  ,[gd].[StartDate]
		  ,[gd].[EndDate]
		  ,[gd].[IsActive]
		  ,[gd].[IsDeleted]
		  ,[gd].[DateCreated]
		  ,[gd].[DateModified]
		 ,TotalCount = count(1)over()

	  FROM [dbo].[GroupDiscounts] as gd
		  INNER JOIN [dbo].[DiscountTypes] as dt 
		on gd.DiscountTypeId = dt.Id
		  INNER JOIN dbo.Partners as p 
		on p.Id= gd.PartnerId
	  WHERE gd.PartnerId = @PartnerId  AND IsDeleted = 0 
		ORDER BY PartnerId
 		OFFSET @offSet Rows
		Fetch Next @PageSize Rows ONLY
END
GO
