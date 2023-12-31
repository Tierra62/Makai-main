USE [Makai]
GO
/****** Object:  Table [dbo].[LoyaltyPointsSource]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoyaltyPointsSource](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[PointsAwarded] [int] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsExpired] [bit] NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifiedBy] [int] NOT NULL,
	[DateExpire] [datetime2](7) NULL,
 CONSTRAINT [PK_LoyaltyPointsSource] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[LoyaltyPointsSource] ADD  CONSTRAINT [DF_LoyaltyPointsSource_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[LoyaltyPointsSource] ADD  CONSTRAINT [DF_LoyaltyPointsSource_IsExpired]  DEFAULT ((0)) FOR [IsExpired]
GO
ALTER TABLE [dbo].[LoyaltyPointsSource] ADD  CONSTRAINT [DF_LoyaltyPointsSource_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[LoyaltyPointsSource] ADD  CONSTRAINT [DF_LoyaltyPointsSource_DateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO
ALTER TABLE [dbo].[LoyaltyPointsSource]  WITH CHECK ADD  CONSTRAINT [FK_LoyaltyPointsSource_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[LoyaltyPointsSource] CHECK CONSTRAINT [FK_LoyaltyPointsSource_Users]
GO
ALTER TABLE [dbo].[LoyaltyPointsSource]  WITH CHECK ADD  CONSTRAINT [FK_LoyaltyPointsSource_Users1] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[LoyaltyPointsSource] CHECK CONSTRAINT [FK_LoyaltyPointsSource_Users1]
GO
