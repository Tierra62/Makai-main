USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[StandCodes_Insert]    Script Date: 5/9/2023 10:21:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Lino Cruz
-- Create date: 05/04/2023
-- Description: Inserts new record into [dbo].[StandCodes]
-- Code Reviewer: Kenneth Montoya

-- MODIFIED BY:
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note: 
-- =============================================

CREATE PROC [dbo].[StandCodes_Insert]
			@UniqueCode nvarchar(40)
			,@StandId int
			,@CreatedBy int
			,@Id int OUTPUT

/*------------------------TEST CODE----------------

DECLARE @Id int = 0;

DECLARE @UniqueCode nvarchar(32) = 'UFN2334SDVN34534588998'
	,@StandId int = 2
	,@CreatedBy int = 8

EXECUTE [dbo].[StandCodes_Insert]
						 @UniqueCode
						 ,@StandId
						 ,@CreatedBy
						 ,@Id OUTPUT

SELECT *
FROM [dbo].[StandCodes]
WHERE Id = @Id;

*/

AS

BEGIN

	INSERT INTO [dbo].[StandCodes]
			   ([UniqueCode]
			   ,[StandId]
			   ,[CreatedBy])
    VALUES
           (@UniqueCode
		   ,@StandId
		   ,@CreatedBy)

	SET @Id = SCOPE_IDENTITY(); --return the most recent IDENTITY value inserted in the same scope

END


GO
