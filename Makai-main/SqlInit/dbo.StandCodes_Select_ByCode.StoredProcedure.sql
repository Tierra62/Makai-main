USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[StandCodes_Select_ByCode]    Script Date: 5/9/2023 10:21:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Lino Cruz
-- Create date: 05/04/2023
-- Description: Select a record from [dbo].[StandCodes] by UniqueCode.
-- Code Reviewer: Kenneth Montoya

-- MODIFIED BY:
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note: 
-- =============================================

CREATE PROC [dbo].[StandCodes_Select_ByCode]
			@Code nvarchar(40)

/*------------------------TEST CODE----------------

DECLARE @Code nvarchar(40) = 'UFN2334SDVN34534588998';

EXECUTE [dbo].[StandCodes_Select_ByCode]
						 @Code
*/

AS

BEGIN

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
	FROM [dbo].[StandCodes] as sc INNER JOIN dbo.[Stands] as s
	on sc.[StandId] = s.[Id]
	INNER JOIN dbo.[Locations] as l
	on s.[LocationId] = l.[Id]
	INNER JOIN dbo.[Partners] as p
	on s.[PartnerId]  = p.[Id]
	WHERE sc.UniqueCode = @Code

END


GO
