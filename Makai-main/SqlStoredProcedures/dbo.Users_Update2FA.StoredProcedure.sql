USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Users_Update2FA]    Script Date: 5/10/2023 10:00:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:			Josiah Gonzales
-- Create date:		5/3/2023
-- Description:		Update Is2FA in Users Table
-- Code Reviewer:	Santiago Llanos

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[Users_Update2FA]
		@Id int
		,@Bool2FA bit

as

/* ---Test---

DECLARE @Id int = 707
		,@Bool2FA int = 0

SELECT *
FROM [dbo].[Users]
WHERE Id = @Id

EXECUTE [dbo].[Users_Update2FA]
	@Id
	,@Bool2FA

SELECT *
FROM [dbo].[Users]
WHERE Id = @Id

	*/

BEGIN
	
	Declare @Date datetime2(7) = GETUTCDATE();

	UPDATE [dbo].[Users]
		SET [Is2FA] = @Bool2FA
		   ,[DateModified] = @Date

		WHERE Id = @Id

END
GO
