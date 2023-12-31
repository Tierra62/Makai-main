USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Products_SelectAll_WithFavs]    Script Date: 5/17/2023 9:38:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
=============================================
AUTHOR: Roy Moran

DATE CREATED: 23FEB2023

DESCRIPTION: Paginated select all for products.

CODE REVIEWER:

MODIFIED BY: author

MODIFIED DATE:12/1/2020

Code Reviewer:

Note:
=============================================
*/

CREATE PROC [dbo].[Products_SelectAll_WithFavs]
									@UserId int = NULL
									, @PageIndex int
									,@PageSize int

AS

/* ---------------- TEST CODE ----------------

Declare @PageIndex int = 0
		,@PageSize int = 5
		,@userId int = 577

Execute dbo.[Products_SelectAll_WithFavs]
					@userId 
					,@PageIndex 
					,@PageSize 

*/

BEGIN

DECLARE @Offset int =  @PageIndex * @PageSize

SELECT p.[Id]
	  ,p.[Name]
	  ,p.[ProductTypeId]
	  ,pt.[Name]
      ,p.[Description]
      ,p.[StandId]
      ,p.[Identifier]
      ,p.[StatusType]
	  ,s.[Name]
      ,p.[HourlyPriceInCents]
      ,p.[Position]
	  ,p.[CreatedBy]
	  ,p.[ModifiedBy]
	  ,pi.[FileId]
	  ,f.[Url]
      ,p.[DateCreated]
      ,p.[DateModified]
	  , isFavorite = ( CASE WHEN EXISTS (SELECT PS.ProductId
					   FROM dbo.ProductsFavorites as PS
					   WHERE PS.UserId = @UserId AND PS.ProductId = p.Id ) 
							 THEN CAST(0 as bit) 
							 ELSE CAST(1 as bit)  
					  END
	    )
	  , TotalCount = Count(1) OVER()

  FROM [dbo].[Products] as p 
		inner join [dbo].[ProductTypes] as pt
		on p.[ProductTypeId] = pt.[Id]
		inner join [dbo].[StatusTypes] as s
		on s.[Id] = p.[StatusType]
		inner join dbo.ProductImages as pi
		on pi.ProductId = p.Id
		inner join dbo.files as f
		on pi.FileId = f.Id

ORDER BY Id
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;

END
GO
