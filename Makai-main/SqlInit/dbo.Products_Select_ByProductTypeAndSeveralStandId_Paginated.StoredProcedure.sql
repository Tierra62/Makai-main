USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Products_Select_ByProductTypeAndSeveralStandId_Paginated]    Script Date: 5/17/2023 9:38:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
=============================================
AUTHOR: Santiago Llanos

DATE CREATED: 09/05/2023

DESCRIPTION: Paginated select by product type and standId.

CODE REVIEWER:

MODIFIED BY: 

MODIFIED DATE:

Code Reviewer:

Note:
=============================================
*/

CREATE PROC [dbo].[Products_Select_ByProductTypeAndSeveralStandId_Paginated]

	@StandIds [dbo].[Int_Udt] READONLY
	,@PageIndex int
	,@PageSize int
	,@ProductTypeId int = null
	,@UserId int 

AS

/*

Declare @PageIndex int = 0
	,@PageSize int = 20
	--,@ProductTypeId int = null
	,@ProductTypeId int = 2;
	--,@ProductTypeId int = 3;

Declare	@StandIds [dbo].[Int_Udt]

insert into @StandIds ([Data])
	--values (2)
	--values (6)
	  values (1), (2)

Execute [dbo].[Products_Select_ByProductTypeAndSeveralStandId_Paginated]
	@StandIds
	,@PageIndex 
	,@PageSize 
	,@ProductTypeId
	,@UserId 
					


*/

BEGIN

	DECLARE 
		@Offset int =  @PageIndex * @PageSize
	DECLARE 
		@TotalStands int = 
			(
			SELECT 
				Count(*) 
			from @StandIds 
			)

	SELECT 
		p.[Id]
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
		,pim.[FileId]
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
		inner join dbo.ProductImages as pim
		on pim.ProductId = p.Id
		inner join dbo.files as f
		on pim.FileId = f.Id
		--left outer join @StandIds as si
		--	on si.[Data] = p.standId
	WHERE 
		(
			(
			p.ProductTypeId = @ProductTypeId 
			or 
			@ProductTypeId is null
			) 
		and 
			(
			(@TotalStands = 0) 
			OR 
			Exists 
				(
				SELECT 
					1
				FROM @StandIds as si2
				WHERE si2.[Data] = p.StandId

				)
			)
		)
	ORDER BY ProductTypeId
	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY;

END
GO
