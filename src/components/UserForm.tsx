import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserFormData {
  age: string;
  sex: string;
  language: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
}

export const UserForm = ({ onSubmit }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    age: '',
    sex: '',
    language: 'ar'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age || !formData.sex) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  const languages = [
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'الإنجليزية' },
  ];

  return (
    <form dir="rtl" onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="age">العمر</Label>
        <Input
          id="age"
          type="number"
          min="0"
          max="120"
          required
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          className="w-full text-right"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sex">الجنس</Label>
        <Select
          value={formData.sex}
          onValueChange={(value) => setFormData({ ...formData, sex: value })}
        >
          <SelectTrigger className="w-full text-right">
            <SelectValue placeholder="اختر الجنس" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">ذكر</SelectItem>
            <SelectItem value="female">أنثى</SelectItem>
            <SelectItem value="other">آخر</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">اللغة المفضلة</Label>
        <Select
          value={formData.language}
          onValueChange={(value) => setFormData({ ...formData, language: value })}
        >
          <SelectTrigger className="w-full text-right">
            <SelectValue placeholder="اختر اللغة" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        تحليل التقرير
      </Button>
    </form>
  );
};