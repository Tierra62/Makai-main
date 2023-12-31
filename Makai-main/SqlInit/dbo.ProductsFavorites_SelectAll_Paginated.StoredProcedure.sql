USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[ProductsFavorites_SelectAll_Paginated]    Script Date: 5/17/2023 9:38:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
=============================================
AUTHOR: Roy Moran

DATE CREATED: 27MAR2023

DESCRIPTION: Paginated select all for favorited products per user. ordered by product id currently.

CODE REVIEWER:

MODIFIED BY: Roy Moran

MODIFIED DATE:	30MAR2023

Code Reviewer: 

Note:	originally only returned bridge table data, now returns all data for the card.
=============================================
*/

CREATE PROC [dbo].[ProductsFavorites_SelectAll_Paginated]
					@UserId int
					,@PageIndex int
					,@PageSize int

AS

/*

	DECLARE	@UserId int = 577
			,@PageIndex int = 0
			,@PageSize int = 10

	EXECUTE [dbo].[ProductsFavorites_SelectAll_Paginated]
					@UserId
					,@PageIndex
					,@PageSize

*/

BEGIN

	DECLARE	@Offset int = @PageIndex * @PageSize

	SELECT	p.[Id]
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
			,totalCount = Count(1) OVER()
	
	FROM	[dbo].[ProductsFavorites] as pf
			inner join [dbo].[Products] as p 
			on p.[Id] = pf.[ProductId]
			inner join [dbo].[ProductTypes] as pt
			on p.[ProductTypeId] = pt.[Id]
			inner join [dbo].[StatusTypes] as s
			on s.[Id] = p.[StatusType]
			inner join dbo.ProductImages as pi
			on pi.ProductId = p.Id
			inner join dbo.files as f
			on pi.FileId = f.Id
	
	WHERE	pf.[UserId] = @UserId

	ORDER BY Id
	OFFSET	@Offset ROWS
	FETCH NEXT	@PageSize ROWS ONLY;

END
GO
