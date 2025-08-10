import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CenteredCardProps {
  title: string;
  content: React.ReactNode;
}

export function CenteredCard({ title, content }: CenteredCardProps) {
  return (
    <Card className="h-full flex flex-col items-center p-4 bg-white border-none shadow-sm">
      <CardHeader className="p-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 w-full">
        {content}
      </CardContent>
    </Card>
  );
}
