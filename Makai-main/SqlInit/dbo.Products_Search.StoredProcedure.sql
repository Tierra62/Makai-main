USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Products_Search]    Script Date: 5/17/2023 9:38:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
=============================================
AUTHOR: Roy Moran

DATE CREATED: 14MAR2023

DESCRIPTION: Paginated select by product type.

CODE REVIEWER:

MODIFIED BY: author

MODIFIED DATE:12/1/2020

Code Reviewer:

Note:
=============================================
*/

CREATE PROC [dbo].[Products_Search]
									@UserId int
									,@PageIndex int
									,@PageSize int
									,@Query nvarchar(50)

AS

/*

Declare  @UserId int =577
		,@PageIndex int = 0
		,@PageSize int = 5
		,@Query nvarchar(50) = 'PR'

Execute dbo.Products_Search
					@UserId
					,@PageIndex 
					,@PageSize 
					,@Query

Select	*
from	dbo.Products as p inner join dbo.ProductImages as pi 
		on p.Id = pi.ProductId
		inner join dbo.ProductTypes as pt
		on pt.Id = p.ProductTypeId

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
	WHERE	p.[Name] LIKE '%' + @Query + '%' OR
			p.[Description] LIKE '%' + @Query + '%' OR
			p.[StandId] LIKE '%' + @Query + '%' OR
			p.[Identifier] LIKE '%' + @Query + '%' OR
			s.[Name] LIKE '%' + @Query + '%' OR
			p.[HourlyPriceInCents] LIKE '%' + @Query + '%' OR
			pt.[Name] LIKE '%' + @Query + '%' OR
			p.[Position] LIKE '%' + @Query + '%'

ORDER BY Id
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;

END
GO
