USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Products_Select_ByStandId]    Script Date: 5/17/2023 9:38:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
=============================================
AUTHOR: Roy Moran

DATE CREATED: 23FEB2023

DESCRIPTION: Select by Stand Id procedure.

CODE REVIEWER:

MODIFIED BY: author

MODIFIED DATE:12/1/2020

Code Reviewer:

Note:
=============================================
*/


CREATE PROC [dbo].[Products_Select_ByStandId]
			@StandId int
			,@UserId int
AS

/*

Declare @StandId int = 1
		,@Userid int = 577

Execute dbo.Products_Select_ByStandId
		@StandId
		,@UserId

Select	*
from	dbo.Products as p inner join dbo.ProductImages as pi 
		on p.Id = pi.ProductId
		inner join dbo.ProductTypes as pt
		on pt.Id = p.ProductTypeId

*/

BEGIN

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

WHERE	StandId = @StandId


END
GO
