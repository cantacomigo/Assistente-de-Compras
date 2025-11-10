import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ItemCompra, ResultadoComparacao } from '@/types/list';
import { ArrowLeft, Share2, FileText, Save, TrendingUp } from 'lucide-react';
import { formatBRL } from '@/utils/format';
import { showSuccess, showError } from '@/utils/toast';

interface ComparacaoProps {
    list: ItemCompra[];
    comparisonResult: ResultadoComparacao | null;
}

const Comparacao: React.FC<ComparacaoProps> = ({ list, comparisonResult }) => {
    const navigate = useNavigate();

    if (!comparisonResult || list.length === 0) {
        // Redireciona se não houver dados de comparação
        React.useEffect(() => {
            if (!comparisonResult) {
                showError("Nenhum resultado de comparação encontrado. Por favor, gere uma lista primeiro.");
                navigate('/');
            }
        }, [comparisonResult, navigate]);
        return null;
    }

    const subtotais = list.map(item => ({
        item: item.nome,
        qtd: `${item.quantidade} ${item.unidade}`,
        proenca: item.precos.proenca !== null ? item.precos.proenca * item.quantidade : null,
        iquegami: item.precos.iquegami !== null ? item.precos.iquegami * item.quantidade : null,
        max: item.precos.max !== null ? item.precos.max * item.quantidade : null,
    }));

    const { totalProenca, totalIquegami, totalMax, melhorOpcao, economiaMax, economiaMedia } = comparisonResult;

    const handleExportPDF = () => {
        // Implementação de exportação de PDF (requer biblioteca externa ou lógica de impressão)
        showSuccess("Funcionalidade de Exportar PDF em desenvolvimento!");
    };

    const handleShare = () => {
        // Implementação de compartilhamento
        const shareText = `Comparei minha lista de compras e a melhor opção é o ${melhorOpcao.supermercado}, economizando ${formatBRL(economiaMax)}! Use o Comparador de Preços Supermercados!`;
        navigator.clipboard.writeText(shareText);
        showSuccess("Texto de comparação copiado para a área de transferência!");
    };

    const handleSaveComparison = () => {
        // Implementação de salvar comparação no banco
        showSuccess("Comparação salva com sucesso! (Implementação de banco de dados em andamento)");
    };

    return (
        <Layout title="Resultados da Comparação">
            <div className="space-y-8">
                
                {/* Seção de Sugestão */}
                <Card className="bg-green-50 border-green-400 dark:bg-green-900/20 dark:border-green-700 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center">
                            <TrendingUp className="h-6 w-6 mr-2" /> Melhor Opção de Compra
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-3xl font-extrabold text-green-800 dark:text-green-300">
                            {melhorOpcao.supermercado}: {formatBRL(melhorOpcao.total)}
                        </p>
                        
                        {economiaMax > 0 && (
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                Você economiza <span className="font-bold text-red-600 dark:text-red-400">{formatBRL(economiaMax)}</span> indo ao {melhorOpcao.supermercado} comparado ao supermercado mais caro.
                            </p>
                        )}
                        {economiaMedia > 0 && (
                            <p className="text-md text-gray-600 dark:text-gray-400">
                                Economia média de <span className="font-semibold text-blue-600 dark:text-blue-400">{formatBRL(economiaMedia)}</span> comparado à média dos preços.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Tabela de Comparação Detalhada */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-blue-700 dark:text-blue-400">
                            Detalhes dos Subtotais por Item
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                <TableRow>
                                    <TableHead className="w-1/4">Item</TableHead>
                                    <TableHead className="text-center">Qtd</TableHead>
                                    <TableHead className="text-right">Proença (R$)</TableHead>
                                    <TableHead className="text-right">Iquegami (R$)</TableHead>
                                    <TableHead className="text-right">Max (R$)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subtotais.map((sub, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{sub.item}</TableCell>
                                        <TableCell className="text-center text-sm">{sub.qtd}</TableCell>
                                        <TableCell className="text-right">{sub.proenca !== null ? formatBRL(sub.proenca) : '-'}</TableCell>
                                        <TableCell className="text-right">{sub.iquegami !== null ? formatBRL(sub.iquegami) : '-'}</TableCell>
                                        <TableCell className="text-right">{sub.max !== null ? formatBRL(sub.max) : '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter className="bg-blue-50 dark:bg-blue-900/20 font-bold">
                                <TableRow>
                                    <TableCell colSpan={2} className="text-lg">TOTAL GERAL</TableCell>
                                    <TableCell className={`text-right text-lg ${totalProenca === melhorOpcao.total ? 'text-green-600' : ''}`}>
                                        {formatBRL(totalProenca)}
                                    </TableCell>
                                    <TableCell className={`text-right text-lg ${totalIquegami === melhorOpcao.total ? 'text-green-600' : ''}`}>
                                        {formatBRL(totalIquegami)}
                                    </TableCell>
                                    <TableCell className={`text-right text-lg ${totalMax === melhorOpcao.total ? 'text-green-600' : ''}`}>
                                        {formatBRL(totalMax)}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>

                {/* Botões de Ação */}
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    <Button 
                        onClick={() => navigate('/lista')} 
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar e Editar
                    </Button>
                    <Button 
                        onClick={handleSaveComparison} 
                        variant="secondary"
                    >
                        <Save className="h-4 w-4 mr-2" /> Salvar Comparação
                    </Button>
                    <Button 
                        onClick={handleExportPDF} 
                        variant="secondary"
                    >
                        <FileText className="h-4 w-4 mr-2" /> Exportar PDF
                    </Button>
                    <Button 
                        onClick={handleShare} 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Share2 className="h-4 w-4 mr-2" /> Compartilhar
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default Comparacao;