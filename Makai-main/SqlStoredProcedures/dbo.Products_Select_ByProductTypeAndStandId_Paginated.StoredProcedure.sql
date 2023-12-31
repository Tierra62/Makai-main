USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Products_Select_ByProductTypeAndStandId_Paginated]    Script Date: 3/05/2023 8:04:04 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
=============================================
AUTHOR: Santiago Llanos

DATE CREATED: 05/01/2023

DESCRIPTION: Paginated select by product type and standId.

CODE REVIEWER:

MODIFIED BY: 

MODIFIED DATE:

Code Reviewer:

Note:
=============================================
*/

CREATE PROC [dbo].[Products_Select_ByProductTypeAndStandId_Paginated]
									@PageIndex int
									,@PageSize int
									,@ProductTypeId int = null
									,@StandId int = null

AS

/*

Declare @PageIndex int = 0
		,@PageSize int = 5
		,@ProductTypeId int = 2
		,@StandId int

Execute [dbo].[Products_Select_ByProductTypeAndStandId_Paginated]
					@PageIndex 
					,@PageSize 
					,@ProductTypeId
					,@StandId

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

   WHERE (p.StandId = @StandId or @StandId is null) and (p.ProductTypeId = @ProductTypeId or @ProductTypeId is null)


ORDER BY ProductTypeId
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;

END
GO
