import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import {
    Brain, Trophy, Award, Clock, CheckCircle2, XCircle, Star,
    Zap, Target, ChevronRight, Download, Shield, Flame, ArrowRight, RotateCcw
} from "lucide-react";

interface Quiz {
    id: string;
    title: string;
    domain: string;
    questions: number;
    duration: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    icon: string;
    color: string;
    completedBy: number;
    passingScore: number;
}

interface Question {
    id: number;
    text: string;
    options: string[];
    correct: number;
}

interface BadgeItem {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    earned: boolean;
    earnedDate?: string;
    requirement: string;
}

const quizzes: Quiz[] = [
    { id: "1", title: "Data Structures & Algorithms", domain: "Computer Science", questions: 15, duration: "30 min", difficulty: "Intermediate", icon: "🧮", color: "from-blue-500 to-cyan-500", completedBy: 342, passingScore: 80 },
    { id: "2", title: "Web Development Fundamentals", domain: "Full Stack", questions: 20, duration: "25 min", difficulty: "Beginner", icon: "🌐", color: "from-emerald-500 to-green-500", completedBy: 567, passingScore: 80 },
    { id: "3", title: "Machine Learning Essentials", domain: "AI/ML", questions: 15, duration: "35 min", difficulty: "Advanced", icon: "🤖", color: "from-purple-500 to-pink-500", completedBy: 189, passingScore: 80 },
    { id: "4", title: "Database Management Systems", domain: "Backend", questions: 12, duration: "20 min", difficulty: "Intermediate", icon: "🗄️", color: "from-orange-500 to-amber-500", completedBy: 423, passingScore: 80 },
    { id: "5", title: "System Design Principles", domain: "Architecture", questions: 10, duration: "40 min", difficulty: "Advanced", icon: "🏗️", color: "from-red-500 to-rose-500", completedBy: 156, passingScore: 80 },
    { id: "6", title: "Cloud Computing & DevOps", domain: "Infrastructure", questions: 15, duration: "30 min", difficulty: "Intermediate", icon: "☁️", color: "from-sky-500 to-indigo-500", completedBy: 278, passingScore: 80 },
];

const sampleQuestions: Question[] = [
    { id: 1, text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
    { id: 2, text: "Which data structure uses LIFO principle?", options: ["Queue", "Stack", "Array", "Linked List"], correct: 1 },
    { id: 3, text: "What is the worst-case time complexity of quicksort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correct: 2 },
    { id: 4, text: "Which traversal visits the root node first?", options: ["Inorder", "Preorder", "Postorder", "Level Order"], correct: 1 },
    { id: 5, text: "What is a balanced BST?", options: ["All nodes have two children", "Height difference ≤ 1 for all subtrees", "All leaves at same level", "Root is the median"], correct: 1 },
];

const badges: BadgeItem[] = [
    { id: "1", title: "First Quiz", description: "Complete your first assessment", icon: Star, color: "text-amber-500", earned: true, earnedDate: "2024-01-15", requirement: "Complete 1 quiz" },
    { id: "2", title: "Quick Learner", description: "Score 90%+ on any quiz", icon: Zap, color: "text-blue-500", earned: true, earnedDate: "2024-02-10", requirement: "Score ≥ 90%" },
    { id: "3", title: "Knowledge Seeker", description: "Complete 5 different assessments", icon: Brain, color: "text-purple-500", earned: false, requirement: "Complete 5 quizzes" },
    { id: "4", title: "Domain Expert", description: "Score 95%+ in any domain", icon: Trophy, color: "text-yellow-500", earned: false, requirement: "Score ≥ 95%" },
    { id: "5", title: "Perfectionist", description: "Get a perfect score on any quiz", icon: Target, color: "text-emerald-500", earned: false, requirement: "Score 100%" },
    { id: "6", title: "Iron Will", description: "Complete 10 assessments", icon: Shield, color: "text-red-500", earned: false, requirement: "Complete 10 quizzes" },
    { id: "7", title: "Streak Master", description: "Complete quizzes 7 days in a row", icon: Flame, color: "text-orange-500", earned: false, requirement: "7-day streak" },
    { id: "8", title: "All-Rounder", description: "Pass quizzes in all domains", icon: Award, color: "text-indigo-500", earned: false, requirement: "Pass all domains" },
];

const difficultyColor = (d: string) => {
    if (d === "Beginner") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (d === "Intermediate") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
};

export default function SkillAssessment() {
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [quizState, setQuizState] = useState<"idle" | "active" | "result">("idle");
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(300);
    const [showCertificate, setShowCertificate] = useState(false);

    const startQuiz = (quiz: Quiz) => {
        setActiveQuiz(quiz);
        setQuizState("active");
        setCurrentQ(0);
        setAnswers({});
        setTimeLeft(300);
    };

    const selectAnswer = (qId: number, optIndex: number) => {
        setAnswers(prev => ({ ...prev, [qId]: optIndex }));
    };

    const finishQuiz = () => {
        setQuizState("result");
    };

    const score = Object.entries(answers).reduce((acc, [qId, ans]) => {
        const q = sampleQuestions.find(q => q.id === Number(qId));
        return acc + (q && q.correct === ans ? 1 : 0);
    }, 0);

    const scorePercent = Math.round((score / sampleQuestions.length) * 100);
    const passed = scorePercent >= 80;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold font-display">Skill <span className="gradient-text">Assessment</span></h1>
                        <p className="text-muted-foreground">Test your knowledge, earn certificates & badges</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                            <Trophy className="h-3.5 w-3.5 text-amber-500" /> 2 Certificates
                        </Badge>
                        <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                            <Award className="h-3.5 w-3.5 text-blue-500" /> 2/8 Badges
                        </Badge>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Quizzes Taken", value: "8", icon: Brain, color: "text-primary bg-primary/10" },
                        { label: "Avg. Score", value: "87%", icon: Target, color: "text-emerald-500 bg-emerald-500/10" },
                        { label: "Certificates", value: "2", icon: Award, color: "text-amber-500 bg-amber-500/10" },
                        { label: "Active Streak", value: "3 days", icon: Flame, color: "text-orange-500 bg-orange-500/10" },
                    ].map(s => (
                        <Card key={s.label} variant="glass">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${s.color}`}>
                                    <s.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{s.value}</p>
                                    <p className="text-xs text-muted-foreground">{s.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="quizzes" className="space-y-4">
                    <TabsList className="bg-muted/50">
                        <TabsTrigger value="quizzes">Available Quizzes</TabsTrigger>
                        <TabsTrigger value="badges">Badges & Certificates</TabsTrigger>
                        <TabsTrigger value="history">My History</TabsTrigger>
                    </TabsList>

                    {/* Quizzes Tab */}
                    <TabsContent value="quizzes" className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map(quiz => (
                                <Card key={quiz.id} variant="glass" className="group hover:ring-2 hover:ring-primary/30 transition-all duration-300 overflow-hidden">
                                    <div className={`h-1.5 bg-gradient-to-r ${quiz.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="text-3xl">{quiz.icon}</div>
                                            <Badge variant="outline" className={difficultyColor(quiz.difficulty)}>
                                                {quiz.difficulty}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{quiz.title}</h3>
                                            <p className="text-xs text-muted-foreground">{quiz.domain}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Brain className="h-3 w-3" /> {quiz.questions} questions</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {quiz.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-muted-foreground">{quiz.completedBy} completions</span>
                                            <Button size="sm" variant="gradient" className="gap-1" onClick={() => startQuiz(quiz)}>
                                                Start <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Badges Tab */}
                    <TabsContent value="badges" className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {badges.map(badge => (
                                <Card key={badge.id} variant="glass" className={`transition-all duration-300 ${badge.earned ? "ring-1 ring-primary/20" : "opacity-60"}`}>
                                    <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                                        <div className={`h-16 w-16 rounded-full flex items-center justify-center ${badge.earned ? "bg-primary/10" : "bg-muted/50"}`}>
                                            <badge.icon className={`h-8 w-8 ${badge.earned ? badge.color : "text-muted-foreground/50"}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{badge.title}</h4>
                                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                                        </div>
                                        {badge.earned ? (
                                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 text-[10px]">
                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Earned {badge.earnedDate}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px]">{badge.requirement}</Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-4">
                        <Card variant="glass">
                            <CardHeader><CardTitle className="text-lg">Recent Assessments</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { title: "Web Development Fundamentals", score: 92, date: "Mar 3, 2026", passed: true },
                                    { title: "Data Structures & Algorithms", score: 85, date: "Feb 28, 2026", passed: true },
                                    { title: "Machine Learning Essentials", score: 72, date: "Feb 25, 2026", passed: false },
                                ].map((h, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {h.passed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                            <div>
                                                <p className="font-medium text-sm">{h.title}</p>
                                                <p className="text-[10px] text-muted-foreground">{h.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-lg font-bold ${h.passed ? "text-emerald-500" : "text-red-500"}`}>{h.score}%</span>
                                            <Button size="sm" variant="outline" className="gap-1">
                                                <RotateCcw className="h-3 w-3" /> Retry
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Quiz Dialog */}
                <Dialog open={quizState !== "idle"} onOpenChange={() => { setQuizState("idle"); setActiveQuiz(null); }}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        {quizState === "active" ? (
                            <div className="space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center justify-between">
                                        <span>{activeQuiz?.title}</span>
                                        <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> 5:00</Badge>
                                    </DialogTitle>
                                    <DialogDescription>Question {currentQ + 1} of {sampleQuestions.length}</DialogDescription>
                                </DialogHeader>
                                <Progress value={((currentQ + 1) / sampleQuestions.length) * 100} className="h-2" />
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">{sampleQuestions[currentQ].text}</h3>
                                    <div className="grid gap-2">
                                        {sampleQuestions[currentQ].options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => selectAnswer(sampleQuestions[currentQ].id, i)}
                                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${answers[sampleQuestions[currentQ].id] === i
                                                        ? "border-primary bg-primary/10 shadow-md"
                                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                                    }`}
                                            >
                                                <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(c => c - 1)}>Previous</Button>
                                    {currentQ < sampleQuestions.length - 1 ? (
                                        <Button variant="gradient" onClick={() => setCurrentQ(c => c + 1)} disabled={answers[sampleQuestions[currentQ].id] === undefined}>
                                            Next <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    ) : (
                                        <Button variant="gradient" onClick={finishQuiz} disabled={Object.keys(answers).length !== sampleQuestions.length}>
                                            Submit Quiz
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : quizState === "result" ? (
                            <div className="text-center space-y-6 py-4">
                                <div className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center ${passed ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}`}>
                                    {passed ? <Trophy className="h-12 w-12" /> : <XCircle className="h-12 w-12" />}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">{scorePercent}%</h2>
                                    <p className="text-muted-foreground">{score}/{sampleQuestions.length} correct answers</p>
                                </div>
                                <p className={`text-lg font-semibold ${passed ? "text-emerald-500" : "text-red-500"}`}>
                                    {passed ? "🎉 Congratulations! You passed!" : "Keep practicing! You need 80% to pass."}
                                </p>
                                {passed && (
                                    <Button variant="gradient" className="gap-2" onClick={() => setShowCertificate(true)}>
                                        <Download className="h-4 w-4" /> Download Certificate
                                    </Button>
                                )}
                                <div className="flex gap-2 justify-center">
                                    <Button variant="outline" onClick={() => { setQuizState("idle"); setActiveQuiz(null); }}>Back to Quizzes</Button>
                                    <Button variant="outline" onClick={() => { setQuizState("active"); setCurrentQ(0); setAnswers({}); }}>
                                        <RotateCcw className="h-4 w-4 mr-1" /> Retry
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </DialogContent>
                </Dialog>

                {/* Certificate Dialog */}
                <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
                    <DialogContent className="max-w-lg">
                        <div className="border-4 border-double border-primary/30 rounded-xl p-8 text-center space-y-4 bg-gradient-to-b from-primary/5 to-transparent">
                            <Award className="h-16 w-16 mx-auto text-amber-500" />
                            <h2 className="text-2xl font-bold font-display">Certificate of Achievement</h2>
                            <p className="text-muted-foreground">This certifies that</p>
                            <p className="text-xl font-bold text-primary">Student Name</p>
                            <p className="text-muted-foreground">has successfully completed</p>
                            <p className="text-lg font-semibold">{activeQuiz?.title}</p>
                            <p className="text-muted-foreground">with a score of <span className="font-bold text-emerald-500">{scorePercent}%</span></p>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
                                <span>Issued: March 5, 2026</span>
                                <span>•</span>
                                <span>ID: CERT-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
