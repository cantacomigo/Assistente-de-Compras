import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
    {
        quote: "Finalmente uma ferramenta que me mostra de verdade onde é mais barato fazer as compras do mês. Já economizei mais de R$150!",
        name: "Ana Silva",
        title: "Mãe e Dona de Casa",
        avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
        quote: "Uso toda semana! É incrível como os preços variam. O app me ajuda a tomar a decisão certa sem perder tempo.",
        name: "Carlos Pereira",
        title: "Estudante Universitário",
        avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
        quote: "Simples, direto ao ponto e funciona. Recomendo para qualquer um que queira ter mais controle sobre seus gastos com supermercado.",
        name: "Juliana Costa",
        title: "Planejadora Financeira",
        avatar: "https://i.pravatar.cc/150?img=5"
    }
];

const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-12 sm:py-16">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight">O que nossos usuários dizem</h2>
                <p className="mt-2 text-lg text-muted-foreground">A economia real na vida de pessoas reais.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardContent className="p-6 flex-grow">
                            <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                        </CardContent>
                        <div className="p-6 pt-0 flex items-center">
                            <Avatar>
                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;