USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[ProductsFavorites_SelectAll]    Script Date: 5/17/2023 9:38:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
=============================================
AUTHOR: Roy Moran

DATE CREATED: 27MAR2023

DESCRIPTION: Gets all of the favorited products per user.

CODE REVIEWER:

MODIFIED BY: Roy Moran

MODIFIED DATE: 30MAR2023

Code Reviewer:

Note: now returns all product data, not just id and userId.
=============================================
*/

CREATE PROC [dbo].[ProductsFavorites_SelectAll]
					@UserId int
					

AS

/*

	DECLARE @UserId int = 34

	EXECUTE dbo.ProductsFavorites_SelectAll
					@UserId

	SELECT	*
	FROM	dbo.ProductsFavorites

	SELECT	*
	FROM	dbo.Products

*/
BEGIN

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
			,pf.[UserId]
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

END
GO
