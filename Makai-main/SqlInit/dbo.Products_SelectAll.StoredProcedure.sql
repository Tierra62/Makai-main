USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Products_SelectAll]    Script Date: 5/17/2023 9:38:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
=============================================
AUTHOR: Roy Moran

DATE CREATED: 13MAR2023

DESCRIPTION: Select all products (for front end.)

CODE REVIEWER:

MODIFIED BY: author

MODIFIED DATE:12/1/2020

Code Reviewer:

Note:
=============================================
*/
CREATE PROC [dbo].[Products_SelectAll]

AS

/*
	Execute dbo.Products_SelectAll
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
END
GO
