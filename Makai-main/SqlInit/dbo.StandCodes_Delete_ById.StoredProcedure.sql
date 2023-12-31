USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[StandCodes_Delete_ById]    Script Date: 5/9/2023 10:21:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Lino Cruz
-- Create date: 05/04/2023
-- Description: Delete a record from [dbo].[StandCodes] by Id.
-- Code Reviewer: Kenneth Montoya

-- MODIFIED BY:
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note: 
-- =============================================

CREATE PROC [dbo].[StandCodes_Delete_ById]			
			@Id int

/*------------------------TEST CODE----------------

DECLARE @Id int = 6;

SELECT *
FROM [dbo].[StandCodes]
WHERE Id = @Id;

EXECUTE [dbo].[StandCodes_Delete_ById]	
						 @Id

SELECT *
FROM [dbo].[StandCodes]
WHERE Id = @Id;

*/

AS

BEGIN
  
  DELETE FROM [dbo].[StandCodes]
	WHERE Id = @Id;

END


GO
