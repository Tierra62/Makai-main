USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[StandCodes_SelectAll]    Script Date: 5/9/2023 10:21:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Lino Cruz
-- Create date: 05/04/2023
-- Description: Select all records from [dbo].[StandCodes].
-- Code Reviewer: Kenneth Montoya

-- MODIFIED BY:
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note: 
-- =============================================

CREATE PROC [dbo].[StandCodes_SelectAll]
				@PageIndex int
				,@PageSize int

/*------------------------TEST CODE----------------
DECLARE @PageIndex int = 0
		,@PageSize int = 5


EXECUTE [dbo].[StandCodes_SelectAll]
			@PageIndex
			,@PageSize
*/ -----------------------------------------------

AS

BEGIN

	DECLARE @offset int = @PageIndex * @PageSize

	SELECT sc.[Id]
			,sc.[UniqueCode]
			,sc.[StandId]		
			,l.[Longitude]
			,l.[Latitude]
			,l.[LineOne]
			,l.[LineTwo]
			,l.[City]
			,l.[Zip]
			,p.[Id] as PartnerId
			,p.[Logo] as PartnerLogo
			,sc.[DateCreated]
			,sc.[CreatedBy]
			,TotalCount = COUNT(1) OVER()
	FROM [dbo].[StandCodes] as sc INNER JOIN dbo.[Stands] as s
	on sc.[StandId] = s.[Id]
	INNER JOIN dbo.[Locations] as l
	on s.[LocationId] = l.[Id]
	INNER JOIN dbo.[Partners] as p
	on s.[PartnerId]  = p.[Id]
	ORDER BY sc.[Id] ASC

	OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY;

END


GO
