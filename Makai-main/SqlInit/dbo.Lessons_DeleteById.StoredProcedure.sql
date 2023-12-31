USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Lessons_DeleteById]    Script Date: 5/6/2023 7:09:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Amanda Totin
-- Create date: 04/10/2023
-- Description: Deletes a record by Id in dbo.Lessons
-- Code Reviewer: Miguel Munoz

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[Lessons_DeleteById]
		@Id int

AS

	/*

	Declare @Id int = 3

	Select * 
	from dbo.Lessons
	WHERE Id = @Id;

	Execute dbo.Lessons_DeleteById @Id

	Select * 
	from dbo.Lessons
	WHERE Id = @Id;

	*/



BEGIN

		DELETE FROM [dbo].[Lessons]
		WHERE Id = @Id;

END
GO
