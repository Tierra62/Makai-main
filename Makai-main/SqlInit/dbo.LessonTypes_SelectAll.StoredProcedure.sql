USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[LessonTypes_SelectAll]    Script Date: 5/6/2023 7:09:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Amanda Totin
-- Create date: 04/10/2023
-- Description: Selects all records from dbo.LessonTypes
-- Code Reviewer: Miguel Munoz

-- MODIFIED BY: 
-- MODIFIED DATE: 
-- Code Reviewer: 
-- Note:
-- =============================================
CREATE proc [dbo].[LessonTypes_SelectAll]
AS
/*

		Execute dbo.LessonTypes_SelectAll;

*/

BEGIN	
		SELECT
				Id,
				Name

		FROM
				dbo.LessonTypes
END
GO
